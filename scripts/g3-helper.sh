#!/bin/bash

# G3 Helper Script for Laravel Development

# Function to run G3 with project context
g3-laravel() {
    local task="$1"
    if [ -z "$task" ]; then
        echo "Usage: g3-laravel \"<task description>\""
        echo "Example: g3-laravel \"create migration for user feedback table\""
        return 1
    fi

    # Run G3 with Laravel-specific context
    echo "🤖 G3 is working on: $task"
    g3 "$task" --config .g3-config.toml
}

# Function for autonomous mode with requirements
g3-autonomous() {
    echo "🚀 Starting G3 autonomous mode with current requirements..."
    g3 --autonomous --config .g3-config.toml
}

# Function for planning mode
g3-plan() {
    echo "📋 Starting G3 planning mode..."
    g3 --planning --codepath . --workspace ../g3_workspace --config .g3-config.toml
}

# Function for quick Laravel tasks
g3-migration() {
    local table="$1"
    local columns="$2"
    g3-laravel "create migration for $table table with columns: $columns"
}

g3-controller() {
    local resource="$1"
    g3-laravel "generate $resource Controller with full CRUD operations"
}

g3-component() {
    local component="$1"
    local description="$2"
    g3-laravel "create React component $component: $description"
}

# Export functions
export -f g3-laravel g3-autonomous g3-plan g3-migration g3-controller g3-component

echo "✅ G3 Laravel helper functions loaded!"
echo "Available commands:"
echo "  g3-laravel \"<task>\"           - Run G3 with Laravel context"
echo "  g3-autonomous                  - Run autonomous mode"
echo "  g3-plan                        - Run planning mode"
echo "  g3-migration <table> <columns> - Create migration"
echo "  g3-controller <resource>       - Create controller"
echo "  g3-component <name> <desc>     - Create React component"