# Name of the stage to deploy to (not supported yet).
STAGE = dev
# Name of this application.
NAME = cognito-vue-example-auth
# Name of the bucket where the terraform state will be persisted (must exist previously).
AWS_STATE_BUCKET = github-deployment-terraform
# Path where the state for this component will be within the AWS_STATE_BUCKET.
AWS_STATE_KEY = ${STAGE}/${NAME}
# Name of the aws region to deploy to.
AWS_REGION = "eu-central-1"

# All variables for terraform
TF_VARS = \
  -var "STAGE=$(STAGE)" \
  -var "NAME=$(NAME)"

terraform_folder = "./terraform"

.PHONY:
tf-init:
	terraform -chdir="${terraform_folder}" init \
	   -backend-config="bucket=${AWS_STATE_BUCKET}" \
	   -backend-config="key=${AWS_STATE_KEY}" \
	   -backend-config="region=${AWS_REGION}" $(TF_VARS)

.PHONY: tf-init
tf-plan: tf-init
	terraform -chdir="${terraform_folder}" plan $(TF_VARS)

.PHONY: tf-init
tf-apply: tf-init
	terraform -chdir="${terraform_folder}" apply -auto-approve $(TF_VARS)
