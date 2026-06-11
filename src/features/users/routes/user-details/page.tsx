import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { userQuery } from "@/features/users/api/user-queries";

export function UserDetailsPage() {
  const { id } = useParams();
  // Dados já pré-carregados pelo loader (ensureQueryData) — leitura do cache.
  const { data: user } = useQuery(userQuery(id!));

  return (
    <div>
      <h1>User details</h1>
      <p>
        <strong>#{user?.id}</strong> — {user?.name}
      </p>
      <p>{user?.email}</p>
    </div>
  );
}
