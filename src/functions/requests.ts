import { ecdhDataT } from "../typings/crypt";
import { doubleReturn } from "../typings/global";
import {
  getRandomMoviesResT,
  postHandshakeResT,
  postSignInResT,
  postSignUpResT,
} from "../typings/requests";
import { userT } from "../typings/user";
import { decryptHexAndIVHex, encryptStringToHexAndIVHex } from "./aes";

const API_URL = import.meta.env.VITE_API_URL as string;

async function responseBodyConverter<T>(
  requestResponse: Response,
  ecdhData?: ecdhDataT
): Promise<T> {
  if (
    requestResponse.headers.get("content-type")?.includes("text/html") &&
    ecdhData !== undefined
  ) {
    const decryptRes = await decryptHexAndIVHex(
      ecdhData,
      await requestResponse.text()
    );

    if (!decryptRes.status) return decryptRes as T;

    return JSON.parse(decryptRes.value) as T;
  } else {
    return (await requestResponse.json()) as T;
  }
}

async function encryptedFetch<ExpectedReturnValue>(
  ecdhData: ecdhDataT,
  url: string,
  options:
    | { method: "POST"; JSONBody: Record<string, unknown> }
    | { method: "GET" },
  sessionID?: string
): Promise<doubleReturn<ExpectedReturnValue>> {
  try {
    const reqOptions: RequestInit & { headers: HeadersInit } = {
      headers: { "X-Client-ID": ecdhData.clientID },
    };

    if (options.method === "POST") {
      const encryptRes = await encryptStringToHexAndIVHex(
        ecdhData,
        JSON.stringify(options.JSONBody)
      );

      if (!encryptRes.status) {
        return encryptRes as doubleReturn<ExpectedReturnValue>;
      }

      reqOptions.body = encryptRes.value;
      reqOptions["method"] = "POST";
      reqOptions.headers["Content-Type" as keyof HeadersInit] = "text/html";
    }

    if (options.method === "GET") {
      reqOptions["method"] = "GET";
    }

    if (sessionID !== undefined) {
      const encryptRes = await encryptStringToHexAndIVHex(ecdhData, sessionID);

      if (!encryptRes.status) {
        return encryptRes as doubleReturn<ExpectedReturnValue>;
      }

      reqOptions.headers["Authorization" as keyof HeadersInit] =
        encryptRes.value;
    }

    const res = await fetch(url, reqOptions);

    const decryptRes = await responseBodyConverter(res, ecdhData);

    return decryptRes as doubleReturn<ExpectedReturnValue>;
  } catch (error) {
    console.log(error);

    return {
      status: false,
      message: "Fetch error.",
    } as doubleReturn<ExpectedReturnValue>;
  }
}

async function requestServerKeyHexAndClientID(
  clientPublicKeyHex: string
): Promise<doubleReturn<postHandshakeResT>> {
  try {
    const res = await fetch(API_URL + "/handshake", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientPublicKey: clientPublicKeyHex,
      }),
    });

    return responseBodyConverter<doubleReturn<postHandshakeResT>>(res);
  } catch (error) {
    console.log(error);
    return { status: false, message: "Fetch error occurred." };
  }
}

async function requestSignUp(
  ecdhData: ecdhDataT,
  username: string,
  password: string,
  rePassword: string
): Promise<doubleReturn<postSignUpResT>> {
  try {
    const res = await encryptedFetch<postSignUpResT>(
      ecdhData,
      API_URL + "/auth/signUp",
      {
        method: "POST",
        JSONBody: {
          username,
          password,
          rePassword,
        },
      }
    );

    return res;
  } catch (error) {
    console.log(error);
    return { status: false, message: "Fetch error occurred." };
  }
}

async function requestSignIn(
  ecdhData: ecdhDataT,
  username: string,
  password: string
): Promise<doubleReturn<postSignInResT>> {
  try {
    const res = await encryptedFetch<postSignInResT>(
      ecdhData,
      API_URL + "/auth/signIn",
      {
        method: "POST",
        JSONBody: {
          username,
          password,
        },
      }
    );

    return res;
  } catch (error) {
    return { status: false, message: "Fetch error occurred." };
  }
}

async function requestRandomMovies(
  ecdhData: ecdhDataT,
  sessionID: string
): Promise<doubleReturn<getRandomMoviesResT>> {
  try {
    const res = await encryptedFetch<getRandomMoviesResT>(
      ecdhData,
      API_URL + "/data/randomMovies",
      { method: "GET" },
      sessionID
    );

    return res;
  } catch (error) {
    return { status: false, message: "Fetch error occurred." };
  }
}

async function requestVerifySessionID(
  ecdhData: ecdhDataT,
  sessionID: string
): Promise<doubleReturn<userT>> {
  try {
    const res = await encryptedFetch<userT>(
      ecdhData,
      API_URL + "/auth/verifySession",
      { method: "GET" },
      sessionID
    );

    return res;
  } catch (error) {
    return { status: false, message: "Fetch error occurred." };
  }
}

export {
  requestServerKeyHexAndClientID,
  requestSignUp,
  requestSignIn,
  requestRandomMovies,
  requestVerifySessionID,
};
