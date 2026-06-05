# API Service Provider

# apiClient.js

### Базовый HTTP-клиент (чтобы не дублировать fetch)

# Сервис products.js

### Пример использования

```js
import { productsService } from '@services/products'
```

### Методы

```js
// Список всех товаров
getProducts()

// Получить товар по ID
getProductById(id)
```

### Методы TBD. Метод есть, не протестировано

```js
// Создать товар
createProduct(data)

// Обновить товар
updateProduct(id, data)
```

# Сервис orders.js

### Пример использования

```js
import { ordersService } from '@services/orders'
```

### Методы

```js
// Список всех заказов
getOrders()

// Заказ по ID
getOrderById(id)
```

### Методы TBD. Метод есть, не протестировано

```js
// Создать заказ
createOrder(data)
```

# Сервис tags.js

### Пример использования

```js
import { tagsService } from '@services/tags'
```

### Методы

```js
// Список всех тэгов
getTags()
```

### Методы TBD. Метод есть, не протестировано

```js
// Создать тэг
createTag(data)
```

## Пример полученных данных

![Скриншот](https://storage.yandexcloud.net/soondawn-backet/screenshot-test-api.jpg)
![Скриншот](https://storage.yandexcloud.net/soondawn-backet/screenshot-test-api-2.jpg)
