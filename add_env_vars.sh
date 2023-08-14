#!/bin/bash

# Define the file name
env_file=".env.production"

# Function to add/update variable in .env.production
add_env_vars() {
  # Loop through each key in the .env.production file
  for key in $(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$env_file" | sed -E 's/=.*//'); do
    echo "Processing key: $key"
    # Get the value currently set in the .env.production file
    value=$(grep "^$key=" "$env_file" | sed -E "s/^$key=//")
    
    echo "Current value for $key: $value"
    
    # Check if the value is empty (not set)
    if [ -z "$value" ]; then
      echo "Value is empty for $key, checking environment variable..."
      # Get the value of the environment variable with the same name
      env_value=$(printenv "$key")
      
      # Check if the environment variable is set
      if [ -n "$env_value" ]; then
        echo "Setting value for $key from environment variable: $env_value"
        # Update or add the environment variable in the .env.production file
        sed -i "s/^$key=.*/$key=$env_value/" "$env_file"
      fi
    fi
  done
}

# Call the function to add/update environment variables
add_env_vars

# Display the updated .env.production file
cat "$env_file"
