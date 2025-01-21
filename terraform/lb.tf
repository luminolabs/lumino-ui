# External HTTPS load balancer
resource "google_compute_global_forwarding_rule" "lumino_ui" {
  name                  = "lumino-ui-fwd-rule"
  target                = google_compute_target_https_proxy.lumino_ui.id
  port_range            = "443"
  ip_address            = google_compute_global_address.lumino_ui.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

resource "google_compute_global_address" "lumino_ui" {
  name = "lumino-ui-ip"
}

# HTTPS proxy
resource "google_compute_target_https_proxy" "lumino_ui" {
  name       = "lumino-ui-proxy"
  url_map    = google_compute_url_map.lumino_ui.id
  ssl_certificates = [google_compute_managed_ssl_certificate.lumino_ui.id]
  ssl_policy = google_compute_ssl_policy.lumino_ui.id
}

# SSL certificate
resource "google_compute_managed_ssl_certificate" "lumino_ui" {
  name = "lumino-ui-ssl-cert"

  managed {
    domains = ["api.${var.environment}.luminolabs.ai"]
  }
}

# SSL Policy
resource "google_compute_ssl_policy" "lumino_ui" {
  name            = "lumino-ui-ssl-policy"
  profile         = "MODERN"
  min_tls_version = "TLS_1_2"
}

# URL map
resource "google_compute_url_map" "lumino_ui" {
  name            = "lumino-ui-url-map"
  default_service = google_compute_backend_service.lumino_ui.id
}

# URL map for HTTP-to-HTTPS redirect
resource "google_compute_url_map" "lumino_ui_redirect" {
  name = "lumino-ui-redirect-url-map"

  # Default action is to redirect to HTTPS
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

# HTTP proxy that references the redirect URL map
resource "google_compute_target_http_proxy" "lumino_ui_redirect" {
  name    = "lumino-ui-redirect-proxy"
  url_map = google_compute_url_map.lumino_ui_redirect.id
}

# Global forwarding rule for HTTP (port 80)
# Points to the redirect proxy
resource "google_compute_global_forwarding_rule" "lumino_ui_http_redirect" {
  name                  = "lumino-ui-http-redirect-fwd-rule"
  target                = google_compute_target_http_proxy.lumino_ui_redirect.id
  port_range            = "80"
  ip_address            = google_compute_global_address.lumino_ui.id
  load_balancing_scheme = "EXTERNAL_MANAGED"
}

# Backend service
resource "google_compute_backend_service" "lumino_ui" {
  name                  = "lumino-ui-backend"
  protocol              = "HTTP"
  port_name             = "web"
  timeout_sec           = 30
  load_balancing_scheme = "EXTERNAL_MANAGED"
  health_checks         = [google_compute_health_check.lumino_ui.id]
  security_policy       = google_compute_security_policy.lumino_ui.id

  backend {
    group           = google_compute_instance_group_manager.lumino_ui.instance_group
    balancing_mode  = "UTILIZATION"
    max_utilization = 0.8
    capacity_scaler = 1.0
  }

  log_config {
    enable      = true
    sample_rate = 1.0
  }

  connection_draining_timeout_sec = 300
}

# HTTP health check
resource "google_compute_health_check" "lumino_ui" {
  name               = "lumino-ui-health"
  timeout_sec        = 5
  check_interval_sec = 5

  http_health_check {
    port         = var.ui_internal_port
    request_path = "/v1/health"
  }
}

# Security policy with rate limiting and DDOS protection
resource "google_compute_security_policy" "lumino_ui" {
  name = "lumino-ui-sec-policy"

  # Default rule (lowest priority, evaluated last)
  rule {
    action      = "allow"
    priority    = 2147483647  # 32-bit signed integer max value
    description = "Default rule to allow all traffic"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
  }

  # Rate limiting rule
  rule {
    action      = "throttle"
    priority    = 1000
    description = "Rate limiting rule"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }

    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"
      rate_limit_threshold {
        count        = 90
        interval_sec = 60
      }
    }
  }

  adaptive_protection_config {
    layer_7_ddos_defense_config {
      enable = true
    }
  }
}