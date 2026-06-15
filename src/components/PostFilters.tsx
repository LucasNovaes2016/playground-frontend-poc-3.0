import { useState, type FormEvent } from "react";
import type { User } from "../types";
import "./PostFilters.css";

export interface PostFilterValues {
  title: string;
  userId: string;
}

interface PostFiltersProps {
  users: User[];
  onSearch: (filters: PostFilterValues) => void;
  onClear: () => void;
}

const EMPTY_FILTERS: PostFilterValues = { title: "", userId: "" };

export function PostFilters({ users, onSearch, onClear }: PostFiltersProps) {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ title: title.trim(), userId });
  }

  function handleClear() {
    setTitle("");
    setUserId("");
    onClear();
  }

  return (
    <form className="post-filters" onSubmit={handleSubmit}>
      <div className="post-filters__field">
        <label className="post-filters__label" htmlFor="filter-title">
          Título
        </label>
        <input
          id="filter-title"
          className="post-filters__input"
          type="text"
          placeholder="Buscar por título..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="post-filters__field">
        <label className="post-filters__label" htmlFor="filter-user">
          Usuário
        </label>
        <select
          id="filter-user"
          className="post-filters__input"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        >
          <option value="">Todos os usuários</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="post-filters__actions">
        <button type="submit" className="post-filters__button post-filters__button--primary">
          Pesquisar
        </button>
        <button
          type="button"
          className="post-filters__button"
          onClick={handleClear}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}

export { EMPTY_FILTERS };
