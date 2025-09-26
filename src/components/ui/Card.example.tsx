import { Card, CardHeader, CardBody, CardFooter } from './Card'
import Button from './Button'

// Ejemplo de uso básico
export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-white">
          Estadísticas del Blog
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Resumen de actividad reciente
        </p>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-sm text-gray-400">Posts publicados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">1.2k</p>
            <p className="text-sm text-gray-400">Visitas totales</p>
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <Button variant="secondary" size="sm">
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  )
}

// Ejemplo sin footer
export function CardSimpleExample() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-white">
          Posts Recientes
        </h3>
      </CardHeader>

      <CardBody>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white">Mi primer post</p>
            <span className="text-xs text-gray-400">Hace 2 días</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-white">Introducción a React</p>
            <span className="text-xs text-gray-400">Hace 1 semana</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}