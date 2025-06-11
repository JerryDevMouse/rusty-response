//! TODO
//! Design Doc for notifiers  
//!  
//! Notifier should be easily implemented using Notifier async trait\n  
//! Each notifier should accept JSON as argument, pass it to a formatter(separate design-doc)  
//! And send to some resource, discord, telegram, bitrix24, etc.  
//! Notifiers can be easily added dynamically and fetched from database.
//! static lock below is just a dev solution  
