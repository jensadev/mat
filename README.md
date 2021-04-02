# API for mat

CORS enabled.
There are migrations for sequlize.

## Auth Header

```
headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
}
```

## JSON returned

### Meals

#### Users meals

Paginated

```
{
    "pager": {
        "totalItems": 3,
        "currentPage": 1,
        "pageSize": 7,
        "totalPages": 1,
        "startPage": 1,
        "endPage": 1,
        "startIndex": 0,
        "endIndex": 2,
        "pages": [
            1
        ]
    },
    "pageOfItems": [
        {
            "id": 2,
            "date": "2021-03-20T15:36:49.000Z",
            "typeId": 3,
            "Dish": {
                "name": "Falukorv och makaroner"
            }
        },
        {
            "id": 3,
            "date": "2021-03-20T15:36:49.000Z",
            "typeId": 2,
            "Dish": {
                "name": "Havregrynsgröt"
            }
        },
        {
            "id": 1,
            "date": "2021-03-20T11:27:29.000Z",
            "typeId": 3,
            "Dish": {
                "name": "Falukorv och makaroner"
            }
        }
    ]
}
```

### Dishes
#### Users dishes
```
{
    "dishes": [
        {
            "name": "Falukorv och makaroner"
        },
        {
            "name": "Havregrynsgröt"
        }
    ]
}
```
#### Users most popular dishes
```
{
    "dishes": [
        {
            "count": 2,
            "Dish": {
                "name": "Falukorv och makaroner"
            }
        },
        {
            "count": 1,
            "Dish": {
                "name": "Havregrynsgröt"
            }
        }
    ]
}
```
#### User, suggest a dish
```
{
    "dish": {
        "name": "Falukorv och makaroner"
    }
}
``` 
#### User suggest a 7 day menu
```
{
    "dishes": [
        {
            "Dish": {
                "name": "Falukorv och makaroner"
            }
        },
        {
            "Dish": {
                "name": "Havregrynsgröt"
            }
        }
    ]
}
```

### Errors and Status Codes
If a request fails any validations, expect a 422 and errors in the following format:
```
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
#### Other status codes:
401 for Unauthorized requests, when a request requires authentication but it isn't provided.

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action.

404 for Not found requests, when a resource can't be found to fulfill the request.

## Endpoints

Currently all needs auth.

### Users
Register user
```
POST /api/users
```
Example request body:
```
{
    "user": {
        "email": "test@test.test",
        "password": "testpass123",
        "passwordConfirmation": "testpass123"
    }
}
```

#### Resources 

Get users meals, paginated:
```
GET /api/user/meals
GET /api/user/meals?page=1
```

Get users dishes:
```
GET /api/users/dishes
```

Get users top dishes:
```
GET /api/users/popular
```

Get one of users dishes:
```
GET /api/users/suggest
```
GET a suggested week menu
```
GET /api/users/menu
```

### Meals

Create new meal:
```
POST /api/meals
```
Example request body:
```
{
    "meal": {
        "dish": "Hamburgare",
        "typeId": 3,
        "date": "2021-03-12"
    }
}
```
Update a meal:
```
PATCH /api/meals
```
Example request body:
```
{
    "meal": {
        "id": 11,
        "dish": "Havregrynsgröt",
        "typeId": 2,
        "date": "2021-03-13"
    }
}
```
Delete a meal:
```
DELETE /api/meals/:id
```