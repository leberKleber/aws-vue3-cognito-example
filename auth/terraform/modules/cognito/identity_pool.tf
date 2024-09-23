resource "aws_cognito_identity_pool" "identity_pool" {
  identity_pool_name               = "${var.NAME}-identity-pool"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id     = aws_cognito_user_pool_client.this.id
    provider_name = aws_cognito_user_pool.this.endpoint
  }
}

resource "aws_iam_role" "authenticated_role" {
  name = "${var.NAME}_authenticated_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role" "unauthenticated_role" {
  name = "${var.NAME}_unauthenticated_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.identity_pool.id
          },
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })
}

resource "aws_cognito_identity_pool_roles_attachment" "identity_pool_roles" {
  identity_pool_id = aws_cognito_identity_pool.identity_pool.id

  roles = {
    authenticated   = aws_iam_role.authenticated_role.arn
    unauthenticated = aws_iam_role.unauthenticated_role.arn
  }
}

resource "aws_iam_role_policy" "authenticated_policy" {
  role = aws_iam_role.authenticated_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = ["s3:ListBucket"],
        Effect   = "Allow",
        Resource = "arn:aws:s3:::your-bucket-name"
      },
      {
        Action = ["s3:GetObject", "s3:PutObject"],
        Effect   = "Allow",
        Resource = "arn:aws:s3:::your-bucket-name/*"
      }
    ]
  })
}
