import React, { useState } from "react";
import PopUp from "../PopUpRx";
import Description from "../inputs/DescriptionRx";
import Title from "../inputs/TitleRx";
import styled from "styled-components";
import { Button } from "../inputs/Buttons";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../../hooks/userProfile";
import Validate from "./Validation";
import { useForm } from "react-hook-form";
import InputLabel from "../inputs/InputLabel";
import { Input, Option, Select, InputMask } from "../inputs/Inputs";
import { maskCpf } from "./maskRegex";
import { Tabs, TabsContent, TabsItem, TabsList } from "../TabsRx";

export default function LoginRegistration({ rota }) {
  const [isOpen, setIsOpen] = useState(false);
  const navegacao = rota == "clientes" ? "/inicio-cliente" : "/empresa";

  const navigate = useNavigate();

  const ContainerTwoInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  `;

  const ContainerButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${({ gap }) => (gap ? gap : "2rem")};
  `;

  const [errorsMessage, setErrorsMessage] = useState({});

  function setProfile(data) {
    return rota === "clientes"
      ? {
          id: data.id,
          nome: data.nomeCliente,
          userRole: "cliente",
        }
      : {
          id: data.id,
          nome: data.nomeProfissional,
          type: "pro",
          userRole: "profissional",
        };
  }

  function Cadastrar(event) {
    const { register, handleSubmit, setValue, getValues } = useForm();

    const onSubmit = (data) => {
      api
        .post(`/clientes`, data)
        .then((res) => {
          setUserProfile(setProfile(res.data));
          navigate(navegacao);
        })
        .catch((erro) => {
          if (erro.response.status === 400) {
            console.log(erro);

            setErrorsMessage(Validate(erro.response.data.errors));
          }
        });
    };

    return (
      <>
        <Title>Registro</Title>
        <Description>Faça seu registro</Description>

        <form id="form-registration" onSubmit={handleSubmit(onSubmit)}>
          <InputLabel
            label="Nome"
            input={
              <Input
                name="nomeCliente"
                placeholder="Maria José"
                type="text"
                {...register("nomeCliente")}
              />
            }
            errorLabel={errorsMessage?.nomeCliente}
          />

          <ContainerTwoInput>
            <InputLabel
              label="Data de Nascimento"
              input={
                <Input
                  name="dataNascCliente"
                  type="date"
                  {...register("dataNascCliente")}
                />
              }
              errorLabel={errorsMessage?.dataNascCliente}
            />
            <InputLabel
              label="Genêro"
              input={
                <Select name="generoCliente" {...register("generoCliente")}>
                  <Option value="">Selecione</Option>
                  <Option value="N">Não declarado</Option>
                  <Option value="F">Feminino</Option>
                  <Option value="M">Masculino</Option>
                </Select>
              }
              errorLabel={errorsMessage?.generoCliente}
            />
          </ContainerTwoInput>

          <InputLabel
            label="CPF"
            input={
              <InputMask
                name="cpfCliente"
                mask={maskCpf}
                placeholder="000.000.000.00"
                guide={true}
                defaultValue={getValues("cpfCliente")}
              />
            }
            errorLabel={errorsMessage?.cpfCliente}
          />
          <InputLabel
            label="Email"
            input={
              <Input
                name="email"
                type="email"
                {...register("email")}
                placeholder="example@example.com"
              />
            }
            errorLabel={errorsMessage?.email}
          />
          <InputLabel
            label="Senha"
            input={
              <Input
                name="senha"
                type="password"
                {...register("senha")}
                placeholder="***********"
              />
            }
            errorLabel={errorsMessage?.senha}
          />
          <ContainerButton gap="1rem">
            <Button
              themeButton="confirm"
              type="submit"
              onClick={() =>
                setValue(
                  "cpfCliente",
                  `${new URLSearchParams(
                    new FormData(document.getElementById("form-registration"))
                  ).get("cpfCliente")}`
                )
              }
            >
              Registrar
            </Button>
            <Button themeButton="cancel" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </ContainerButton>
        </form>
      </>
    );
  }

  function Logar(event) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
      api
        .post(`/clientes/autenticar`, data)
        .then((res) => {
          setUserProfile(setProfile(res.data));
          navigate(navegacao);
        })
        .catch((erro) => {
          console.log(erro);

          setErrorsMessage(Validate(erro.response.data.errors));
        });
    };

    return (
      <>
        <Title>Acesso</Title>
        <Description>Faça seu login</Description>
        <form id="form-login" onSubmit={handleSubmit(onSubmit)}>
          <InputLabel
            label="Email"
            input={
              <Input
                name="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
                autoComplete="off"
                autoFocus="off"
              />
            }
            errorLabel={errorsMessage?.email}
          />
          <InputLabel
            label="Senha"
            input={
              <Input
                name="senha"
                placeholder="************"
                type="password"
                {...register("senha")}
                autoComplete="off"
                autoFocus="off"
              />
            }
            errorLabel={errorsMessage?.senha}
          />
          <ContainerButton gap="1rem">
            <Button themeButton="confirm" type="submit">
              Login
            </Button>
            <Button themeButton="cancel" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </ContainerButton>
        </form>
      </>
    );
  }

  // return (
  //   <PopUp textButton="Acessar/Registrar" themeButton="cancel" dropClose>
  //     <Tabs pageDefault="tab1" width="350px">
  //       <TabsList>
  //         <TabsTrigger page="tab1">Acessar</TabsTrigger>
  //         <TabsTrigger page="tab2">Registrar</TabsTrigger>
  //       </TabsList>
  //       <TabsContent page="tab1">
  //         <Title>Acesso</Title>
  //         <Description>Faça seu login</Description>
  //         <form onSubmit={logar}>
  //           <InputLabel name="email" label="Email" errorMessage={errorsMessage["email"]}/>
  //           <InputLabel name="senha" label="Senha" type="password" errorMessage={errorsMessage["senha"]}/>
  //           <ContainerButton gap="1rem">
  //             <Button themeButton="confirm">Logar</Button>
  //           </ContainerButton>
  //         </form>
  //       </TabsContent>
  //       <TabsContent page="tab2">
  //         <Title>Registro</Title>
  //         <Description>Faça seu registro</Description>
  //         <form onSubmit={cadastrar}>
  //           <InputLabel name={rota === "clientes" ? "nomeCliente" : "nomeProfissional"} label="Nome" placeholder="Maria José" errorMessage={errorsMessage[rota === "clientes" ? "nomeCliente" : "nomeProfissional"]}/>
  //           <ContainerTwoInput>
  //             <InputLabel
  //               name={rota === "clientes" ? "dataNascCliente" : "dataNascProfissional"}
  //               width={115}
  //               label="Data Nascimento"
  //               type="date"
  //               errorMessage={errorsMessage[rota === "clientes" ? "dataNascCliente" : "dataNascProfissional"]}
  //             />
  //             <InputLabel
  //               name={rota === "clientes" ? "cpfCliente" : "cpfProfissional"}
  //               width={140}
  //               label="CPF"
  //               placeholder="xxx.xxx.xxx-xx"
  //               errorMessage={errorsMessage[rota === "clientes" ? "cpfCliente" : "cpfProfissional"]}
  //             />
  //           </ContainerTwoInput>
  //           <InputLabel name={rota === "clientes" ? "generoCliente" : "generoProfissional"} errorMessage={errorsMessage[rota === "clientes" ? "generoCliente" : "generoProfissional"]} label="Genêro" />
  //           <InputLabel
  //             name={rota === "clientes" ? "emailCliente" : "emailProfissional"}
  //             label="Email"
  //             placeholder="example@example.com"
  //             errorMessage={errorsMessage[rota === "clientes" ? "emailCliente" : "emailProfissional"]}
  //           />
  //           <InputLabel name={rota === "clientes" ? "senhaCliente" : "senhaProfissional"} label="Senha" type="password" errorMessage={errorsMessage[rota === "clientes" ? "senhaCliente" : "senhaProfissional"]}/>
  //           <ContainerButton gap="1rem">
  //             <Button themeButton="confirm">Registrar</Button>
  //           </ContainerButton>
  //         </form>
  //       </TabsContent>
  //     </Tabs>
  //   </PopUp>
  // );

  return (
    <PopUp
      trigger={
        <Button onClick={() => setIsOpen(true)} themeButton="cancel">
          Acessar/Registrar Cliente
        </Button>
      }
      dropClose
      open={isOpen}
      handleClose={() => setIsOpen(false)}
    >
      <Tabs pageDefault={1} width="420px">
        <TabsList>
          <TabsItem page={1}>Acessar</TabsItem>
          <TabsItem page={2}>Registrar</TabsItem>
        </TabsList>
        <TabsContent page={1}>{Logar()}</TabsContent>
        <TabsContent page={2}>{Cadastrar()}</TabsContent>
      </Tabs>
    </PopUp>
  );
}
