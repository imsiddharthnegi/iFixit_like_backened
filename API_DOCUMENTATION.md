# API Documentation

## Overview

The iFixit-like Backend API provides a RESTful interface for accessing device repair information organized in a hierarchical structure: Categories → Devices → Repair Guides.

## Base URL

```
http://localhost:3000
https://your-app-name.onrender.com
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 10 // for list endpoints only
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Resource not found |
| 500 | Internal server error |

## Endpoints

### Categories

#### GET /api/categories

Get all categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Apple",
      "slug": "apple",
      "created_at": "2025-06-24 08:57:03"
    }
  ],
  "count": 3
}
```

#### GET /api/categories/:slug

Get a specific category by slug.

**Parameters:**
- `slug` (string): Category slug (e.g., "apple")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Apple",
    "slug": "apple",
    "created_at": "2025-06-24 08:57:03"
  }
}
```

#### GET /api/categories/:slug/devices

Get all devices within a specific category.

**Parameters:**
- `slug` (string): Category slug (e.g., "apple")

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Apple",
      "slug": "apple",
      "created_at": "2025-06-24 08:57:03"
    },
    "devices": [
      {
        "id": 1,
        "name": "iPhone 11",
        "slug": "iphone-11",
        "category_id": 1,
        "image_url": "https://example.com/iphone11.jpg",
        "created_at": "2025-06-24 08:57:03"
      }
    ]
  },
  "count": 6
}
```

### Devices

#### GET /api/devices

Get all devices with category information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 11",
      "slug": "iphone-11",
      "category_id": 1,
      "image_url": "https://example.com/iphone11.jpg",
      "created_at": "2025-06-24 08:57:03",
      "category_name": "Apple",
      "category_slug": "apple"
    }
  ],
  "count": 11
}
```

#### GET /api/devices/:slug

Get a specific device by slug.

**Parameters:**
- `slug` (string): Device slug (e.g., "iphone-11")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 11",
    "slug": "iphone-11",
    "category_id": 1,
    "image_url": "https://example.com/iphone11.jpg",
    "created_at": "2025-06-24 08:57:03",
    "category_name": "Apple",
    "category_slug": "apple"
  }
}
```

#### GET /api/devices/:slug/guides

Get all repair guides for a specific device.

**Parameters:**
- `slug` (string): Device slug (e.g., "iphone-11")

**Response:**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": 1,
      "name": "iPhone 11",
      "slug": "iphone-11",
      "category_id": 1,
      "image_url": "https://example.com/iphone11.jpg",
      "created_at": "2025-06-24 08:57:03",
      "category_name": "Apple",
      "category_slug": "apple"
    },
    "guides": [
      {
        "id": 1,
        "title": "iPhone 11 Battery Replacement",
        "slug": "iphone-11-battery-replacement",
        "device_id": 1,
        "difficulty": "Moderate",
        "time_required": "30-60 minutes",
        "tools_required": [
          "Pentalobe Screwdriver",
          "Phillips Screwdriver",
          "Spudger",
          "Suction Handle"
        ],
        "parts_required": [
          "iPhone 11 Replacement Battery",
          "Adhesive Strips"
        ],
        "steps": [
          {
            "title": "Power off your iPhone",
            "description": "Before beginning, power off your iPhone completely."
          }
        ],
        "created_at": "2025-06-24 08:57:03"
      }
    ]
  },
  "count": 2
}
```

### Guides

#### GET /api/guides

Get all repair guides with device and category information.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "iPhone 11 Battery Replacement",
      "slug": "iphone-11-battery-replacement",
      "device_id": 1,
      "difficulty": "Moderate",
      "time_required": "30-60 minutes",
      "tools_required": [
        "Pentalobe Screwdriver",
        "Phillips Screwdriver"
      ],
      "parts_required": [
        "iPhone 11 Replacement Battery"
      ],
      "steps": [
        {
          "title": "Power off your iPhone",
          "description": "Before beginning, power off your iPhone completely."
        }
      ],
      "created_at": "2025-06-24 08:57:03",
      "device_name": "iPhone 11",
      "device_slug": "iphone-11",
      "category_name": "Apple",
      "category_slug": "apple"
    }
  ],
  "count": 8
}
```

#### GET /api/guides/:slug

Get a specific repair guide by slug.

**Parameters:**
- `slug` (string): Guide slug (e.g., "iphone-11-battery-replacement")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "iPhone 11 Battery Replacement",
    "slug": "iphone-11-battery-replacement",
    "device_id": 1,
    "difficulty": "Moderate",
    "time_required": "30-60 minutes",
    "tools_required": [
      "Pentalobe Screwdriver",
      "Phillips Screwdriver",
      "Spudger",
      "Suction Handle"
    ],
    "parts_required": [
      "iPhone 11 Replacement Battery",
      "Adhesive Strips"
    ],
    "steps": [
      {
        "title": "Power off your iPhone",
        "description": "Before beginning, power off your iPhone completely."
      },
      {
        "title": "Remove the pentalobe screws",
        "description": "Remove the two 6.1 mm-long pentalobe screws at the bottom of the iPhone."
      }
    ],
    "created_at": "2025-06-24 08:57:03",
    "device_name": "iPhone 11",
    "device_slug": "iphone-11",
    "category_name": "Apple",
    "category_slug": "apple"
  }
}
```

## Example Usage Workflow

### 1. Browse Categories
```bash
curl http://localhost:3000/api/categories
```

### 2. Explore Apple Devices
```bash
curl http://localhost:3000/api/categories/apple/devices
```

### 3. View iPhone 11 Details
```bash
curl http://localhost:3000/api/devices/iphone-11
```

### 4. Get iPhone 11 Repair Guides
```bash
curl http://localhost:3000/api/devices/iphone-11/guides
```

### 5. View Specific Repair Guide
```bash
curl http://localhost:3000/api/guides/iphone-11-battery-replacement
```

## Data Models

### Category
- `id`: Unique identifier
- `name`: Display name
- `slug`: URL-friendly identifier
- `created_at`: Creation timestamp

### Device
- `id`: Unique identifier
- `name`: Display name
- `slug`: URL-friendly identifier
- `category_id`: Reference to category
- `image_url`: Device image URL
- `created_at`: Creation timestamp

### Guide
- `id`: Unique identifier
- `title`: Guide title
- `slug`: URL-friendly identifier
- `device_id`: Reference to device
- `difficulty`: Repair difficulty level
- `time_required`: Estimated time
- `tools_required`: Array of required tools
- `parts_required`: Array of required parts
- `steps`: Array of step objects with title and description
- `created_at`: Creation timestamp

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### 404 Not Found
```json
{
  "success": false,
  "error": "Category not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch categories"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing rate limiting based on your requirements.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and accepts requests from any origin by default. This can be configured in the server settings.

## Content Type

All requests should use `application/json` content type for POST/PUT requests (when implemented).

All responses are returned as `application/json`.

