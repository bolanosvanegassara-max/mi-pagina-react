import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  ShieldCheck,
} from "lucide-react";

export function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // ACCESO ADMINISTRADOR
  // =========================
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // INGRESAR COMO ADMIN
  // =========================
  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (adminPassword === "0105") {
      // Guardamos que el usuario entró como administrador
      localStorage.setItem("admin", "true");

      // Limpiamos la contraseña
      setAdminPassword("");

      // Entramos al panel administrativo
      navigate("/admin");
    } else {
      alert("Contraseña de administrador incorrecta.");
      setAdminPassword("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // =========================
    // REGISTRO DE CLIENTE
    // =========================
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost/gapsystem/gapsystem/backend/registrar_cliente.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }),
          }
        );

        console.log("Respuesta registro:", response.status);

        const data = await response.json();

        console.log("Datos registro:", data);

        if (data.success) {
          alert("¡Cliente registrado correctamente!");

          setIsSignup(false);

          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          alert(data.message || "No se pudo registrar el cliente.");
        }
      } catch (error) {
        console.error("Error en registro:", error);

        alert(
          "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
        );
      }

      return;
    }

    // =========================
    // INICIO DE SESIÓN CLIENTE
    // =========================
    try {
      const response = await fetch(
        "http://localhost/gapsystem/gapsystem/backend/iniciar_sesion.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      console.log("Respuesta del servidor:", response.status);

      const data = await response.json();

      console.log("Datos recibidos:", data);

      if (data.success) {
        alert(`¡Bienvenido/a, ${data.cliente.nombre}!`);

        console.log("Cliente iniciado:", data.cliente);

        localStorage.setItem(
          "cliente",
          JSON.stringify(data.cliente)
        );

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/dashboard");
      } else {
        alert(data.message || "No se pudo iniciar sesión.");
      }
    } catch (error) {
      console.error("Error en inicio de sesión:", error);

      alert(
        "No se pudo conectar con el servidor. Verifica que XAMPP esté funcionando."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* =========================
          PANEL IZQUIERDO
      ========================= */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1583755391669-5d4e2d1cf3d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwaWxsdXN0cmF0aW9uJTIwZGlnaXRhbHxlbnwxfHx8fDE3NzQyODA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Tecnología"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div className="relative h-full flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a GAPSYSTEM
          </h1>

          <p className="text-lg text-white/90">
            Descubre lo último en tecnología con los mejores precios en
            Colombia
          </p>

          <div className="mt-12 space-y-4">

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                ✓
              </div>

              <div>
                <h3 className="font-semibold">Calidad premium</h3>
                <p className="text-sm text-white/80">
                  Productos auténticos de marcas confiables
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                ✓
              </div>

              <div>
                <h3 className="font-semibold">Envío rápido</h3>
                <p className="text-sm text-white/80">
                  Envío gratis en pedidos superiores a $200.000 COP
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                ✓
              </div>

              <div>
                <h3 className="font-semibold">Pagos seguros</h3>
                <p className="text-sm text-white/80">
                  Transacciones 100% seguras y cifradas
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          PANEL DERECHO
      ========================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md">

          {/* Volver */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          {/* =========================
              ACCESO ADMINISTRADOR
          ========================= */}
          {showAdminLogin ? (
            <div>

              <div className="mb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Acceso administrador
                </h2>

                <p className="text-muted-foreground">
                  Ingresa la contraseña para acceder al panel administrativo
                </p>
              </div>

              <form
                onSubmit={handleAdminLogin}
                className="space-y-5"
              >

                <div>
                  <label
                    htmlFor="adminPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Contraseña de administrador
                  </label>

                  <div className="relative">

                    <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                    <input
                      id="adminPassword"
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) =>
                        setAdminPassword(e.target.value)
                      }
                      placeholder="Ingresa la contraseña"
                      className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowAdminPassword(!showAdminPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showAdminPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Entrar al panel administrativo
                </button>

              </form>

              <div className="mt-6 text-center">

                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword("");
                  }}
                  className="text-sm text-accent hover:text-accent/80 font-medium"
                >
                  ← Volver al inicio de sesión
                </button>

              </div>

            </div>
          ) : (
            <>
              {/* =========================
                  TÍTULO
              ========================= */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {isSignup
                    ? "Crear cuenta"
                    : "Bienvenido de nuevo"}
                </h2>

                <p className="text-muted-foreground">
                  {isSignup
                    ? "Regístrate para empezar a comprar"
                    : "Inicia sesión en tu cuenta para continuar"}
                </p>
              </div>

              {/* =========================
                  FORMULARIO CLIENTE
              ========================= */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Nombre */}
                {isSignup && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Nombre completo
                    </label>

                    <div className="relative">

                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Tu nombre completo"
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required={isSignup}
                      />

                    </div>
                  </div>
                )}

                {/* Correo */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Correo electrónico
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />

                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Contraseña
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                  </div>
                </div>

                {/* Confirmar contraseña */}
                {isSignup && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium mb-2"
                    >
                      Confirmar contraseña
                    </label>

                    <div className="relative">

                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required={isSignup}
                      />

                    </div>
                  </div>
                )}

                {/* Opciones */}
                {!isSignup && (
                  <div className="flex items-center justify-between">

                    <label className="flex items-center space-x-2 cursor-pointer">

                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                      />

                      <span className="text-sm text-muted-foreground">
                        Recordarme
                      </span>

                    </label>

                    <a
                      href="#"
                      className="text-sm text-accent hover:text-accent/80"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>

                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  {isSignup
                    ? "Registrarse"
                    : "Iniciar sesión"}
                </button>

              </form>

              {/* Cambiar Login / Registro */}
              <div className="mt-6 text-center">

                <p className="text-sm text-muted-foreground">

                  {isSignup
                    ? "¿Ya tienes una cuenta?"
                    : "¿No tienes una cuenta?"}{" "}

                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-accent hover:text-accent/80 font-medium"
                  >
                    {isSignup
                      ? "Inicia sesión"
                      : "Regístrate"}
                  </button>

                </p>

              </div>

              {/* =========================
                  BOTÓN ADMIN
              ========================= */}
              {!isSignup && (
                <div className="mt-6 pt-6 border-t border-border">

                  <button
                    type="button"
                    onClick={() => setShowAdminLogin(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Acceso administrador
                  </button>

                </div>
              )}

              {/* =========================
                  REDES SOCIALES
              ========================= */}
              <div className="mt-8">

                <div className="relative">

                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>

                  <div className="relative flex justify-center text-sm">

                    <span className="px-4 bg-background text-muted-foreground">
                      O continúa con
                    </span>

                  </div>

                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">

                  {/* Google */}
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />

                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />

                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />

                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>

                    Google
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.943.359.309.678.919 1.852 1.852 1.852.267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>

                    GitHub
                  </button>

                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
