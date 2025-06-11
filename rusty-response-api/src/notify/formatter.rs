use crate::model::ServerLog;

pub trait NotifierFormatter {
    fn format(&self, line: &ServerLog) -> String;
}
