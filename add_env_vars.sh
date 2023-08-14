#!/bin/bash

# Define the file name
env_file=".env.production"

# Function to add/update variable in .env.production
add_env_vars() {
  # Loop through each key in the .env.production file
  for key in $(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$env_file" | sed -E 's/=.*//'); do
    # Get the value currently set in the .env.production file
    value=$(grep "^$key=" "$env_file" | sed -E "s/^$key=//")
    
    # Check if the value is empty (not set)
    if [ -z "$value" ]; then
      # Get the value of the environment variable with the same name
      env_value=$(printenv "$key")
      
      # Check if the environment variable is set
      if [ -n "$env_value" ]; then
        # Add the environment variable to the .env.production file
        echo "$key=$env_value" >> "$env_file"
      fi
    fi
  done
}

# Call the function to add/update environment variables
add_env_vars

# Display the updated .env.production file
cat "$env_file"
