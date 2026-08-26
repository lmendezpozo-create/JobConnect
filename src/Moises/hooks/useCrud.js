// js/hooks/useCrud.js
// Capa de "orquestación" agnóstica de CRUD.
// Recibe un servicio (con getAll/createItem/updateItem/deleteItem) y un par de
// callbacks para repintar la lista y reportar errores.
//
// Uso:
//   const { load, create, update, remove } = useCrud({
//     service: interviewService,
//     onList: renderItems,
//     onError: mostrarError,
//   });

export const useCrud = ({ service, onList, onError }) => {
  const handleError = (err) => {
    const message = err?.message || String(err || 'Error desconocido');
    if (typeof onError === 'function') {
      onError(message);
    } else {
      console.error(err);
    }
    return message;
  };

  return {
    /** Carga todos los registros y llama onList(payload). */
    async load(params = {}) {
      try {
        const items = (await service.getAll(params)) || [];
        if (typeof onList === 'function') onList(items);
        return items;
      } catch (err) {
        handleError(err);
        return [];
      }
    },

    /** Crea un registro. Devuelve el recurso creado o lanza en caso de fallo. */
    async create(data) {
      try {
        return await service.createItem(data);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },

    /** Actualiza un registro (PUT o PATCH según servicio). */
    async update(id, data) {
      try {
        return await service.updateItem(id, data);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },

    /** Elimina un registro por id. */
    async remove(id) {
      try {
        return await service.deleteItem(id);
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
  };
};