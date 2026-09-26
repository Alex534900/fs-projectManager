import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import FormularioTarea from './FormularioTarea'


afterEach(() => {
  cleanup()
})


describe('FormularioTarea', () => {

  it('llama a onAgregar con el texto escrito por el usuario', async () => {

    // Arrange
    const onAgregar = vi.fn()

    render(<FormularioTarea onAgregar={onAgregar} />)

    const usuario = userEvent.setup()


    // Act
    const input = screen.getByLabelText('Nueva tarea')

    await usuario.type(input, 'Comprar pan')

    await usuario.click(
      screen.getByRole('button', { name: 'Agregar' })
    )


    // Assert
    expect(onAgregar).toHaveBeenCalledWith('Comprar pan')

  })


  it('no llama a onAgregar si el campo está vacío', async () => {

    // Arrange
    const onAgregar = vi.fn()

    render(<FormularioTarea onAgregar={onAgregar} />)

    const usuario = userEvent.setup()


    // Act
    await usuario.click(
      screen.getByRole('button', { name: 'Agregar' })
    )


    // Assert
    expect(onAgregar).not.toHaveBeenCalled()

  })

})