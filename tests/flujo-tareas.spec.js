import { test, expect } from '@playwright/test'

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Entrar a la aplicación
  await page.goto('/')

  // 2. Escribir una nueva tarea
  await page.getByLabel('Nueva tarea').fill('Comprar pan')

  // 3. Presionar el botón Agregar
  await page.getByRole('button', { name: 'Agregar' }).click()

  // 4. Verificar que la tarea aparece en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible()
})