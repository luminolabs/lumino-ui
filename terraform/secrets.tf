resource "google_secret_manager_secret" "lumino_ui_config" {
  secret_id = "lumino-ui-config"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "config" {
  secret = google_secret_manager_secret.lumino_ui_config.id
  secret_data = file("${path.module}/${var.environment}-config.env")
}