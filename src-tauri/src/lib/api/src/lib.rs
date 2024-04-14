use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime,
};

use reqwest::Client;
use std::sync::{Arc, Mutex};
use utils::{errors::AppResult, errors::Error, prelude::*};

const PLUGIN_NAME: &str = "tauri-plugin-request-client";

#[derive(Debug)]
pub struct RESTClient {
    pub http_client: Arc<tauri::async_runtime::Mutex<Client>>,
    pub base_url: Arc<Mutex<String>>,
    pub method: Arc<Mutex<String>>,
    pub body: Arc<Mutex<String>>,
}

/// A function to create a new RESTClient instance
/// ## Arguments
/// - `base_url` The base url of the api to query
impl RESTClient {
    pub fn new(base_url: Option<String>, method: Option<String>) -> Self {
        Self {
            http_client: Arc::new(tauri::async_runtime::Mutex::new(Client::new())),
            base_url: Arc::new(Mutex::new(base_url.unwrap_or_default())),
            method: Arc::new(Mutex::new(method.unwrap_or_default())),
            body: Arc::new(Mutex::new(String::new())),
        }
    }
}

#[derive(Debug)]
pub struct APIPlugin<R: Runtime> {
    pub app_handle: AppHandle<R>,
    pub rest_client: RESTClient,
}

impl<R: Runtime> APIPlugin<R> {
    fn new(app_handle: AppHandle<R>) -> Self {
        let rest_client = RESTClient::new(None, None);
        Self {
            app_handle,
            rest_client,
        }
    }

    fn set_base_url(&self, base_url: String) -> &Self {
        *self.rest_client.base_url.lock().unwrap() = base_url;
        self
    }

    fn set_method(&self, method: String) -> &Self {
        *self.rest_client.method.lock().unwrap() = method;
        self
    }

    fn get_base_url(&self) -> String {
        self.rest_client.base_url.lock().unwrap().clone()
    }

    fn get_method(&self) -> String {
        self.rest_client.method.lock().unwrap().clone()
    }

    fn set_body(&self, body: String) -> &Self {
        *self.rest_client.body.lock().unwrap() = body;
        self
    }

    fn get_body(&self) -> String {
        self.rest_client.body.lock().unwrap().clone()
    }

    async fn request(&self) -> AppResult<String> {
        info!("Making REST request");

        let base_url = self.get_base_url();
        let method = self.get_method();
        let method = method.as_str();
        let body = self.get_body();
        let body = body.trim(); // Trim the body to remove whitespace from both ends

        debug!("JSON Body: {}", self.get_body());

        let body: serde_json::Value = if !body.is_empty() {
            match serde_json::from_str(body) {
                Ok(parsed) => parsed,
                Err(e) => {
                    error!("Failed to parse body: {}", e);
                    serde_json::Value::Null // Use a null JSON value if parsing fails
                }
            }
        } else {
            serde_json::Value::Null // Default to null if body is empty
        };

        let response = match method {
            "GET" => {
                self.rest_client
                    .http_client
                    .lock()
                    .await
                    .get(&base_url)
                    .header("User-Agent", "Lumin")
                    .send()
                    .await?
                    .text()
                    .await?
            }
            "POST" => {
                self.rest_client
                    .http_client
                    .lock()
                    .await
                    .post(&base_url)
                    .json(&body)
                    .header("User-Agent", "Lumin")
                    .send()
                    .await?
                    .text()
                    .await?
            }
            _ => {
                error!("Invalid method");
                return Err(Error::IO(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "Invalid method",
                )));
            }
        };

        debug!("Response: {}", response);

        Ok(response)
    }

    /// A function to run a REST Client and create a new RESTClient instance for each device found
    /// ## Arguments
    /// - `endpoint` The endpoint to query for
    /// - `device_name` The name of the device to query
    /// - `body` The body of the request to send - optional
    async fn run_rest_client(
        &self,
        endpoint: String,
        device_name: String,
        method: String,
        body: String,
    ) -> AppResult<String> {
        info!("Starting REST client");

        let full_url = format!("{}{}", device_name, endpoint);
        info!("[APIPlugin]: Full url: {}", full_url);
        info!("[APIPlugin]: Body: {}", body);

        self.set_base_url(full_url)
            .set_method(method)
            .set_body(body);

        let request_result = self.request().await;
        let response_msg = match request_result {
            Ok(response) => response,
            Err(e) => {
                error!("[APIPlugin]: Request failed: {}", e);
                e.to_string()
            }
        };
        Ok(response_msg)
    }
}

#[tauri::command]
#[specta::specta]
async fn make_request<R: Runtime>(
    endpoint: String,
    device_name: String,
    method: String,
    body: String,
    app_handle: AppHandle<R>,
) -> Result<String, String> {
    info!("Starting REST request");
    let result = app_handle
        .state::<APIPlugin<R>>()
        .run_rest_client(endpoint, device_name, method, body)
        .await;

    match result {
        Ok(response) => {
            info!("[APIPlugin]: Request response: Ok");
            Ok(response)
        }
        Err(e) => {
            error!("[APIPlugin]: Request failed: {}", e);
            Err(e.to_string())
        }
    }
}

#[allow(unused_macros)]
macro_rules! specta_builder {
    ($e:expr, Runtime) => {
        ts::builder()
            .commands(collect_commands![make_request::<$e>])
            .path(generate_plugin_path(PLUGIN_NAME))
            .config(
                specta::ts::ExportConfig::default().formatter(specta::js_doc::formatter::prettier),
            )
        //.events(collect_events![RandomNumber])
    };
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    //let plugin_utils = specta_builder!(R, Runtime).into_plugin_utils(PLUGIN_NAME);
    Builder::new(PLUGIN_NAME)
        //.invoke_handler(plugin_utils.invoke_handler)
        .setup(move |app| {
            let app = app.clone();

            //(plugin_utils.setup)(&app);

            let plugin = APIPlugin::new(app.app_handle());
            app.manage(plugin);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![make_request])
        .build()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn export_types() {
        println!("Exporting types for plugin: {}", PLUGIN_NAME);
        println!("Export path: {}", generate_plugin_path(PLUGIN_NAME));

        assert_eq!(
            specta_builder!(tauri::Wry, Runtime)
                .export_for_plugin(PLUGIN_NAME)
                .ok(),
            Some(())
        );
    }
}
