//! Crate Logger
//!
//! TODO: This needs to be implemented and connected to the tauri logger.
//use crate::{colors::Color, f};
//use log::{LevelFilter, Log, Metadata, Record, SetLoggerError};

/* pub struct LuminLogger {
  inner: Filter,
}

impl LuminLogger {
  pub fn new(log_level: LevelFilter) -> LuminLogger {
    let mut builder = Builder::new();

    //builder
    //    .filter(None, LevelFilter::Info)
    //    .filter(Some("desktop_cleaner"), LevelFilter::Debug);

    builder.filter_level(log_level);
    LuminLogger {
      inner: builder.build(),
    }
  }

  pub fn init(log_level: LevelFilter) -> Result<(), SetLoggerError> {
    let logger = Self::new(log_level);
    log::set_max_level(logger.inner.filter());
    log::set_boxed_logger(Box::new(logger))
  }
}

impl Log for LuminLogger {
  fn enabled(&self, metadata: &Metadata) -> bool {
    self.inner.enabled(metadata)
  }

  fn log(&self, record: &Record) {
    if self.inner.matches(record) {
      println!(
        "{}",
        format_args!(
          "{} {}",
          Color::new(
            f!(
              "[Lumin - {}]:",
              Color::new(record.level().as_str())
                .map_level(record.level())
                .bold(),
            )
            .as_str()
          )
          .bold()
          .green(),
          Color::new(f!("{}", record.args()).as_str()).cyan()
        )
      );
    }
  }

  fn flush(&self) {}
} */

#[macro_export]
macro_rules! etvr_stderr {
    ($($arg:tt)+) => (println!("{}", f!("{} {}", Color::new("[Lumin]:").bold().green(), Color::new($($arg)+).red())));
}

#[macro_export]
macro_rules! etvr_stdout {
    ($($arg:tt)+) => (println!("{}", f!("{} {}", Color::new("[Lumin]:").bold().green(), Color::new($($arg)+).green())));
}

#[allow(unused_imports)]
pub(crate) use etvr_stderr;
#[allow(unused_imports)]
pub(crate) use etvr_stdout;
