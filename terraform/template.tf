resource "google_compute_instance_template" "lumino_ui" {
  project      = var.project_id
  machine_type = "e2-standard-4"
  name         = "lumino-ui-${local.version}-tpl"

  disk {
    source_image = "${var.region}-docker.pkg.dev/${var.resources_project_id}/lum-docker-images/lumino-dashboard:latest"
    auto_delete  = true
    boot         = true
    device_name  = "lumino-ui-disk"
    mode         = "READ_WRITE"
    disk_size_gb = 50
    disk_type    = "pd-balanced"
  }

  network_interface {
    network    = "projects/${var.project_id}/global/networks/default"
    stack_type = "IPV4_ONLY"
    access_config {
      network_tier = "PREMIUM"
    }
  }

  service_account {
    email = google_service_account.lumino_ui.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  metadata = {
    startup-script = "/lumino-dashboard/scripts/mig-runtime/start-services.sh ui"
    LUI_ENV = var.environment
  }

  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
    provisioning_model  = "STANDARD"
    preemptible         = false
  }

  shielded_instance_config {
    enable_secure_boot          = false
    enable_vtpm                 = false
    enable_integrity_monitoring = false
  }

  reservation_affinity {
    type = "ANY_RESERVATION"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = ["lumino-ui-web"]
}

resource "google_compute_firewall" "lumino_ui" {
  name    = "lumino-ui-firewall"
  network = "projects/${var.project_id}/global/networks/default"

  allow {
    protocol = "tcp"
    ports    = [var.ui_internal_port]
  }

  source_ranges = ["35.191.0.0/16", "130.211.0.0/22", "209.85.152.0/22", "209.85.204.0/22"]

  target_tags = ["lumino-ui-web"]
}