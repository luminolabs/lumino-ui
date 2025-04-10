variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "environment" {
  description = "The environment (e.g., dev, prod)"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "resources_project_id" {
  description = "The GCP project ID for resources"
  type        = string
  default     = "neat-airport-407301"
}

variable "ui_internal_port" {
  description = "The internal port for the UI"
  type        = number
  default     = 3000
}