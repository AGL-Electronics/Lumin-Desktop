//! Main crate Error
use crate::{colors::Color, etvr_stderr, etvr_stdout, f};
use serde::{ser::Serializer, Serialize};

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("Generic error: {0}")]
    Generic(String),
    #[error(transparent)]
    IO(#[from] std::io::Error),
    #[error("Operation Canceled error: {0}")]
    OperationCancelled(String),
}

pub type AppResult<T> = std::result::Result<T, Error>;

impl Error {
    pub fn new(message: String) -> Self {
        Self::Generic(message)
    }

    pub fn op_cancelled(message: &str) -> Self {
        Self::OperationCancelled(message.to_string())
    }
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

impl From<reqwest::Error> for Error {
    fn from(e: reqwest::Error) -> Self {
        Error::IO(std::io::Error::new(std::io::ErrorKind::Other, e))
    }
}

// implement std::ops::FromResidual<std::result::Result<std::convert::Infallible, serde_json::Error>> for Error
impl From<std::result::Result<std::convert::Infallible, serde_json::Error>> for Error {
    fn from(e: std::result::Result<std::convert::Infallible, serde_json::Error>) -> Self {
        Error::IO(std::io::Error::new(
            std::io::ErrorKind::Other,
            e.err().unwrap().to_string(),
        ))
    }
}

// required for `std::result::Result<std::string::String, utils::errors::Error>` to implement `std::ops::FromResidual<std::result::Result<std::convert::Infallible, serde_json::Error>>`
impl From<std::convert::Infallible> for Error {
    fn from(e: std::convert::Infallible) -> Self {
        Error::IO(std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))
    }
}

// TODO: Handler for custom errors
pub fn handle(result: AppResult<()>) {
    if let Err(error) = result {
        match error {
            Error::Generic(msg) => {
                etvr_stderr!(&msg);
                std::process::exit(1)
            }
            Error::OperationCancelled(msg) => {
                etvr_stdout!(f!("Operation cancelled: {}", Color::new(&msg).bold()).as_str());
            }
            Error::IO(error) => {
                etvr_stderr!(&error.to_string());
                std::process::exit(1)
            }
        }
    }
}
