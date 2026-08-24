use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum SubscriptionTier {
    Free,
    Basic,
    Pro,
    Ultra,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum AuthPhase {
    Restoring,
    SignedOut,
    SigningIn { step: String },
    SignedIn,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum AuthAccess {
    Unknown,
    Entitled,
    Unverified,
    UpgradeRequired { reason: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserAccount {
    pub email: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthSnapshot {
    pub schema_version: u32,
    pub revision: u64,
    pub phase: AuthPhase,
    pub access: AuthAccess,
    pub user: Option<UserAccount>,
    pub subscription_tier: SubscriptionTier,
    pub can_reopen_browser: bool,
    pub payment_recovery: bool,
}
