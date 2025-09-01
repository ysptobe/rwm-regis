create table if not exists applicants (
  id bigint generated always as identity primary key,
  passport_id text unique not null,
  nationality text,
  prename text,
  sex text,
  type text,
  thai_name text,
  thai_surname text,
  eng_name text,
  eng_surname text,
  birth_year int,
  age int,
  singlet_size text,
  telephone text,
  emergency_contact_phone text,
  email text,
  guardian_name text,
  guardian_relationship text,
  guardian_phone text,
  created_at timestamp default now()
);

create table if not exists app (
  id bigint generated always as identity primary key,
  applicant_id bigint references applicants(id),
  packet_category text,
  generational text,
  delivery_method text,
  created_at timestamp default now()
);

create table if not exists vip (
  id bigint generated always as identity primary key,
  applicant_id bigint references applicants(id),
  created_at timestamp default now()
);

create table if not exists payments (
  id bigint generated always as identity primary key,
  applicant_id bigint references applicants(id),
  final_cost numeric,
  slip_url text,
  transfer_date date,
  transfer_time time,
  created_at timestamp default now()
);
