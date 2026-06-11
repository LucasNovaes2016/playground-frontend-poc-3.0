import { useNavigate } from "react-router-dom";

// Mock estático apenas para navegação (sem chamada de API nas listas).
const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
];

export function UsersListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Users list</h1>
      <button type="button" onClick={() => navigate("/users/create")}>
        Create user
      </button>
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ flex: 1 }}>{user.name}</span>
            <button type="button" onClick={() => navigate(`/users/${user.id}`)}>
              Details
            </button>
            <button type="button" onClick={() => navigate(`/users/${user.id}/edit`)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
