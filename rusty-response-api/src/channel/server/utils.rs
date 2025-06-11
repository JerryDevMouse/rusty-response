use std::collections::BTreeMap;

pub fn is_changed(
    statuses: &BTreeMap<i64, (i64, String)>,
    server_id: i64,
    code: i64,
    reason: Option<&String>,
) -> bool {
    if let Some((prev_code, prev_reason)) = statuses.get(&server_id) {
        if *prev_code != code {
            return true;
        }

        if let Some(r) = reason {
            return r != prev_reason;
        }

        false
    } else {
        true
    }
}

pub fn update_cache(
    statuses: &mut BTreeMap<i64, (i64, String)>,
    server_id: i64,
    code: i64,
    reason: Option<String>,
) {
    statuses.entry(server_id).and_modify(|entry| {
        entry.0 = code;
        if let Some(r) = reason {
            entry.1 = r;
        }
    });
}
