import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tamanoCuadro, setTamanoCuadro] = useState(3);
  const [cuadro, setCuadro] = useState<(number | null)[][]>([]);

  useEffect(() => {
    const cuadroInicial = CrearCuadroVacio(tamanoCuadro);
    setCuadro(cuadroInicial);
  }, []);

  function ResolverCuadro() {
    const cuadroActual = CopiarCuadro(cuadro);
    //Pon tu código aquí
    console.log(cuadroActual);
    EncontrarCuadradoMagico(ConvertirMatrizConNulosACeros(cuadroActual));
  }

  function ConvertirMatrizConNulosACeros(cuadroActual: (number | null)[][]) {
    for (let i = 0; i < cuadroActual.length; i++) {
      for (let j = 0; j < cuadroActual.length; j++) {
        if (cuadroActual[i][j] === null) {
          cuadroActual[i][j] = 0;
        }
      }
    }
    return cuadroActual as number[][];
  }

  function EncontrarCuadradoMagico(
    matriz: number[][],
    posicionFila: number = 0,
    posicionColumna: number = 0,
    numerosDisponibles: number[] = ObtenerNumerosPosibles(matriz)
  ) {
    // Condicional que verifica si hay un elemento en la posicion actual
    if (matriz[posicionFila][posicionColumna] !== 0) {
      // Comprueba si es un cuadrado magico si es que esta en la ultima casilla
      // retorna verdadero si es que si lo es, para que finalicen las anteriores instancias
      // de la funcion
      if (
        posicionFila === matriz.length - 1 &&
        posicionColumna === matriz.length - 1
      ) {
        if (EsCuadradoMagico(matriz)) {
          console.log("Solución Cuadrado Mágico: ");
          console.log(matriz);
          setCuadro(matriz);
          return true;
        }
        return false;
      }

      // Si no esta en la ultima casilla, se asginan nuevos valores para el numero siguiente
      // Si esta en la ultima columna de una fila, tiene que hacer su salto de fila.
      let nuevaPosicionFila = posicionFila;
      let nuevaPosicionColumna = posicionColumna;

      if (posicionColumna === matriz.length - 1) {
        nuevaPosicionFila = posicionFila + 1;
        nuevaPosicionColumna = -1;
      }

      return EncontrarCuadradoMagico(
        matriz,
        nuevaPosicionFila,
        nuevaPosicionColumna + 1,
        numerosDisponibles
      );
    }

    // Si llega aca es porque la posicion en la que estoy no tenia ya un numero predefinido
    // Coloco mi numero mas pequeño que tengo disponible y lo elimino de mi lista de disponibles
    matriz[posicionFila][posicionColumna] = numerosDisponibles[0];
    numerosDisponibles.splice(0, 1);

    // Si llega aca es porque el elemento en la ultima casilla no estaba predefinido y pues ya estamos en la ultima
    // asi que corroboramos si es un cuadrado magico.
    if (
      posicionFila === matriz.length - 1 &&
      posicionColumna === matriz.length - 1
    ) {
      if (EsCuadradoMagico(matriz)) {
        console.log("Solucion Cuadrado Magico: ");
        console.log(matriz);
        setCuadro(matriz);
        return true;
      }

      const numeroReemplazado = matriz[posicionFila][posicionColumna];
      matriz[posicionFila][posicionColumna] = 0;
      numerosDisponibles.push(numeroReemplazado);
      numerosDisponibles.sort();
      return false;
    }

    // Asigno valores de la posicion del siguiente numero
    // Si esta en la ultima columna de una fila, tiene que saltar de fila
    let nuevaPosicionFila = posicionFila;
    let nuevaPosicionColumna = posicionColumna;

    if (posicionColumna === matriz.length - 1) {
      nuevaPosicionFila = posicionFila + 1;
      nuevaPosicionColumna = -1;
    }

    // Determina si los numeros siguientes lograron encontrar la solucion
    // y mientras no, va cambiando de valor hasta que sea el mayor que cualquier
    // numero que haya quedado en la lista, por lo que si llega ahi retorna falso
    // para que las instancias anteriores hagan lo mismo.
    while (
      !EncontrarCuadradoMagico(
        matriz,
        nuevaPosicionFila,
        nuevaPosicionColumna + 1,
        numerosDisponibles
      )
    ) {
      const numeroReemplazado = matriz[posicionFila][posicionColumna];
      let numeroNuevo = -1;
      for (let i = 0; i < numerosDisponibles.length; i++) {
        if (numerosDisponibles[i] > numeroReemplazado) {
          numeroNuevo = numerosDisponibles[i];
          break;
        }
      }

      if (numeroNuevo === -1) {
        matriz[posicionFila][posicionColumna] = 0;
        numerosDisponibles.push(numeroReemplazado);
        numerosDisponibles.sort();
        return false;
      }
      matriz[posicionFila][posicionColumna] = numeroNuevo;
      numerosDisponibles.splice(numerosDisponibles.indexOf(numeroNuevo), 1);
      numerosDisponibles.push(numeroReemplazado);
      numerosDisponibles.sort();
    }
    return true;
  }

  function EsCuadradoMagico(matriz: (number | null)[][]) {
    const sumasTotales: number[] = [];

    for (let i = 0; i < matriz.length * 2 + 1; i++) {
      sumasTotales.push(0);
    }

    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz.length; j++) {
        sumasTotales[i] += matriz[i][j] as number;
        sumasTotales[i + matriz.length] += matriz[j][i] as number;
      }
      sumasTotales[sumasTotales.length - 1] += matriz[i][i] as number;
    }

    for (let i = 0; i < sumasTotales.length - 1; i++) {
      if (sumasTotales[i] !== sumasTotales[i + 1]) return false;
    }

    return true;
  }

  function ObtenerNumerosPosibles(matriz: number[][]) {
    // Creo una lista con los numeros que tengo disponibles a poner
    const numerosDisponibles: number[] = [];
    for (let i = 1; i <= Math.pow(matriz.length, 2); i++) {
      numerosDisponibles.push(i);
    }

    // Quito los numeros que ya estaban predefinidos
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz.length; j++) {
        if (matriz[i][j] !== 0) {
          numerosDisponibles.splice(
            numerosDisponibles.indexOf(matriz[i][j]),
            1
          );
        }
      }
    }

    numerosDisponibles.sort();
    return numerosDisponibles;
  }

  function CambiarTamañoCuadro(e: ChangeEvent<HTMLInputElement>) {
    const nuevoTamaño = Number(e.target.value);
    setTamanoCuadro(nuevoTamaño);
    const nuevoCuadro = CrearCuadroVacio(nuevoTamaño);
    setCuadro(nuevoCuadro);
  }

  function CopiarCuadro(
    cuadroACopiar: (number | null)[][]
  ): (number | null)[][] {
    const copia: (number | null)[][] = [];
    cuadroACopiar.forEach((fila) => {
      copia.push([...fila]);
    });
    return copia;
  }

  function ModificarValorCasilla(fila: number, columna: number, valor: string) {
    const nuevoCuadro = CopiarCuadro(cuadro);
    nuevoCuadro[fila][columna] = valor ? Number(valor) : null;
    setCuadro(nuevoCuadro);
  }

  function CrearCuadroVacio(tamaño: number): (number | null)[][] {
    const cuadro: (number | null)[][] = Array(tamaño)
      .fill(null)
      .map(() => Array(tamaño).fill(null));
    return cuadro;
  }

  function LimpiarCuadrado() {
    const cuadroVacio = CrearCuadroVacio(tamanoCuadro);
    setCuadro(cuadroVacio);
  }

  const controlesCuadro = (
    <div style={{ display: "flex" }}>
      <label htmlFor="tamano" style={{ fontSize: "40px" }}>
        Tamaño del cuadro:
      </label>
      <input
        type="text"
        size={1}
        style={{ fontSize: "40px" }}
        value={tamanoCuadro}
        onChange={CambiarTamañoCuadro}
      />
      <button className="boton_accion" onClick={ResolverCuadro}>
        Resolver Cuadro
      </button>
      <button className="boton_accion" onClick={LimpiarCuadrado}>
        Limpiar Cuadro
      </button>
    </div>
  );

  return (
    <div>
      {controlesCuadro}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <CuadroMagico
          estadoActual={cuadro}
          ModificarCasilla={ModificarValorCasilla}
        />
      </div>
    </div>
  );
}

export default App;

interface CuadroMagicoProps {
  estadoActual: (number | null)[][];
  ModificarCasilla(fila: number, columna: number, valor: string): void;
}

function CuadroMagico({ estadoActual, ModificarCasilla }: CuadroMagicoProps) {
  return (
    <div className="cuadro">
      {estadoActual.map((fila, index) => {
        return (
          <FilaCuadro
            numeroFila={index}
            informacionFila={fila}
            ModificarCasilla={ModificarCasilla}
          />
        );
      })}
    </div>
  );
}

interface FilaCuadroProps {
  numeroFila: number;
  informacionFila: (number | null)[];
  ModificarCasilla(fila: number, columna: number, valor: string): void;
}
function FilaCuadro({
  numeroFila,
  informacionFila,
  ModificarCasilla,
}: FilaCuadroProps) {
  return (
    <div className="filaCuadro">
      {informacionFila.map((valorCasilla, index) => {
        return (
          <>
            <input
              type="text"
              size={2}
              className="casilla"
              value={valorCasilla ? valorCasilla.toString() : ""}
              onChange={(e) =>
                ModificarCasilla(numeroFila, index, e.target.value)
              }
            />
          </>
        );
      })}
    </div>
  );
}
