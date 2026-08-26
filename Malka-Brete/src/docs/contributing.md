# Guía de Contribución — JobConnect

¡Gracias por contribuir a **JobConnect**! Para mantener la calidad y consistencia del proyecto en equipo, sigue los pasos descritos en este documento.

## 1. Flujo de Trabajo en Git

1. **Ramas Personales**:
   - Cada miembro trabaja en su propia rama llamada por su nombre (ejemplo: `Luis`, `Angel`, `Moises`, `kendall`).
2. **Sincronización Frecuente**:
   - Antes de iniciar trabajo nuevo, sincroniza con `main`:
     ```bash
     git checkout main
     git pull origin main
     git checkout <tu-rama>
     git merge main
     ```
3. **Commits Mensajes Descriptivos**:
   - Escribe mensajes claros sobre qué cambia el commit (ejemplo: `git commit -m "Agrega servicio de postulaciones"`).
4. **Push a Tu Rama Remota**:
   - Sube tus avances a tu rama en GitHub:
     ```bash
     git push origin <tu-rama>
     ```

## 2. Reglas de Código
- No modificar directamente el trabajo de otros compañeros sin previa coordinación.
- Verificar que no queden errores sintácticos en JS antes de enviar push.
- Probar que las peticiones a la API funcionen correctamente y no rompan la interfaz.
