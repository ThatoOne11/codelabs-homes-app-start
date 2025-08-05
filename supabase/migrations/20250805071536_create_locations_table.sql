create table locations (
  id integer primary key,
  name text not null,
  city text not null,
  state text not null,
  photo text not null,
  available_units integer not null,
  wifi boolean not null,
  laundry boolean not null
);