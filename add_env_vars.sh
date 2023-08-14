#!/bin/bash

# Define the file name
env_file=".env.production"

# Function to add/update variable in .env.production
add_env_vars() {
  # Loop through each key=value line in the .env.production file
  while IFS= read -r line; do
    # Split the line into key and value
    key="${line%%=*}"
    value="${line#*=}"
    
    # Check if the value is empty (not set)
    if [ -z "$value" ]; then
      # Get the value of the environment variable with the same name
      env_value=$(printenv "$key")
      
      # Check if the environment variable is set
      if [ -n "$env_value" ]; then
        # Add the environment variable to the .env.production file
        sed -i "s/^$key=.*/$key=$env_value/" "$env_file"
      fi
    fi
  done < "$env_file"
}

# Call the function to add/update environment variables
add_env_vars

# Display the updated .env.production file
cat "$env_file"
