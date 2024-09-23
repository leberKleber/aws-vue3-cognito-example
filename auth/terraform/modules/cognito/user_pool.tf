resource "aws_cognito_user_pool" "this" {
  name = "${var.NAME}-user-pool"
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.NAME}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.this.id

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]

  supported_identity_providers = ["COGNITO"]
}
