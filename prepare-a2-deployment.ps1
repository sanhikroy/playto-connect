# PowerShell script to prepare A2 Hosting deployment files
Write-Host "Preparing Connect application for A2 Hosting deployment..."

# Create directories
$deploymentDir = ".\deployment"
$srcDir = "$deploymentDir\src"
$publicDir = "$deploymentDir\public"

# Create directories if they don't exist
if (!(Test-Path -Path $deploymentDir)) {
    New-Item -ItemType Directory -Path $deploymentDir
}
if (!(Test-Path -Path "$deploymentDir\prisma")) {
    New-Item -ItemType Directory -Path "$deploymentDir\prisma"
}
if (!(Test-Path -Path $srcDir)) {
    New-Item -ItemType Directory -Path $srcDir
}
if (!(Test-Path -Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir
}

# Copy source code
Write-Host "Copying source code..."
Copy-Item -Path ".\src\*" -Destination "$srcDir\" -Recurse -Force

# Copy public files
Write-Host "Copying public assets..."
Copy-Item -Path ".\public\*" -Destination "$publicDir\" -Recurse -Force

# Copy configuration files
Write-Host "Copying configuration files..."
Copy-Item -Path ".\next.config.ts" -Destination "$deploymentDir\"
Copy-Item -Path ".\tsconfig.json" -Destination "$deploymentDir\"
Copy-Item -Path ".\postcss.config.mjs" -Destination "$deploymentDir\"
Copy-Item -Path ".\next-env.d.ts" -Destination "$deploymentDir\"

# Create a zip file
Write-Host "Creating deployment ZIP file..."
$zipFileName = "connect-a2-deployment.zip"
if (Test-Path -Path $zipFileName) {
    Remove-Item -Path $zipFileName -Force
}

# PowerShell 5+ has Compress-Archive
Compress-Archive -Path "$deploymentDir\*" -DestinationPath $zipFileName

Write-Host "Deployment preparation complete! The ZIP file '$zipFileName' is ready to be uploaded to A2 Hosting."
Write-Host "Follow the instructions in deployment/README.md to complete the setup on A2 Hosting." 