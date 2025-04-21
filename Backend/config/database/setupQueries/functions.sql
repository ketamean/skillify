create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users(id, created_at, email)
  values (new.id, new.created_at, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger on_auth_user_created on auth.users;