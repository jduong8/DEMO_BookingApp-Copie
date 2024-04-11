# Réalisation d'un Modèle Physique de Données

J'ai utilisé 2 plateformes pour cette partie:

- [dbdiagram.io](https://dbdiagram.io/d) ------> Pratique pour inclure les cardinalités

- [sqldbm](https://sqldbm.com/Home/) -----> Facile à prendre en main.

## DBDIAGRAM

### Voici l'implémentation

```sql
Table User {
  id integer [primary key]
  firstname varchar
  lastname varchar
  phone varchar
  email varchar
  password varchar
  role_id integer [ref: > User_Role.id]
  created_at timestamp
  updated_at timestamp
}

Table User_Role {
  id integer [primary key]
  label varchar
}

Table Reservation {
  id integer [primary key]
  number_of_customer integer
  name varchar
  date date
  time time
  note varchar
  user_id integer [ref: > User.id]
  status_id integer [ref: > Status.id]
  created_at timestamp
  updated_at timestamp
}

Table Status {
  id integer [primary key]
  label varchar
}

Table Product {
  id integer [primary key]
  name varchar
  description varchar
  price double
  category_id integer [ref: > Product_Category.id]
  created_at timestamp
  updated_at timestamp
}

Table Product_Category {
  id integer [primary key]
  label varchar
}

Table Table {
  id integer [primary key]
  seats_count integer
  is_available bool
  has_seats_guests bool
  reservation_id integer [ref: > Reservation.id]
  created_at timestamp
  updated_at timestamp
}


Table Order {
  id integer [primary key]
  quantity integer
  product_id integer [ref: > Product.id]
  created_at timestamp
  updated_at timestamp
}

Table Historic {
  id integer [primary key]
  amount double
  order_id integer [ref: <> Order.id]
  table_id integer [ref: <> Table.id]
  reservation_id integer [ref: < Reservation.id]
}
```

# Aperçu

![](assets/diagram-io.png)

### Explication des associations

Un User est associé à un Role et un Role peut être attribué à plusieurs User. ---> (One-To-Many)

Un User peut effectué plusieurs Réservation mais une Réservation est associé à un seul User. ---> (One-To-Many)

Une Réservation peut avoir un Status et un Status peut être attribué à plusieurs Réservation. ---> (Many-to-One)

Une Réservation est associé à une Table mais une Table peut avoir plusieurs Réservation. ---> (One-To-Many)

Une Table peut avoir plusieurs Order, un Order peut être associé à plusieurs Table. ---> (Many-To-Many)

Un Product est associé à une seule Category mais une Category peut avoir plusieurs Product. ---> (Many-To-One)

Un/plusieurs Product peut être associé à un/plusieurs Order. ---> (Many-To-Many)

## SQLDBM

![](assets/sqldmb.png)
