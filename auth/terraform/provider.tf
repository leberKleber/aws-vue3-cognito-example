terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Will be configured via terraform init.
  }
}

provider "aws" {
  region = "eu-central-1"

  default_tags {
    component = var.NAME
  }
}