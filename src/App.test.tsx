import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";

const mockTasks = [
    { id: 1, text: "Tarea existente", completed: false }
];

beforeEach(() => {
    global.fetch = vi.fn((_url: string, options?: RequestInit) => {
        const method = options?.method ?? "GET";

        if (method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: 2,
                        text: "Tarea nueva",
                        completed: false
                    })
            } as Response);
        }

        if (method === "DELETE") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            } as Response);
        }

        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTasks)
        } as Response);
    });
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe("App", () => {

    it("carga y muestra las tareas desde el backend al montar", async () => {

        render(<App />);

        expect(
            await screen.findByText("Tarea existente")
        ).toBeInTheDocument();

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3000/tasks"
        );

    });

    it("agrega una tarea nueva a la lista", async () => {

        render(<App />);

        await screen.findByText("Tarea existente");

        const usuario = userEvent.setup();

        await usuario.type(
            screen.getByLabelText("Nueva tarea"),
            "Tarea nueva"
        );

        await usuario.click(
            screen.getByRole("button", { name: "Agregar" })
        );

        expect(
            await screen.findByText("Tarea nueva")
        ).toBeInTheDocument();

    });

    it("elimina una tarea de la lista", async () => {

        render(<App />);

        await screen.findByText("Tarea existente");

        const usuario = userEvent.setup();

        await usuario.click(
            screen.getByRole("button", { name: "Eliminar" })
        );

        await waitFor(() => {
            expect(
                screen.queryByText("Tarea existente")
            ).not.toBeInTheDocument();
        });

    });

});
