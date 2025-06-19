import { matchesCharacterSearch } from './matchesCharacterSearch';

const mockCharacter = {
  id: 1,
  image: "",
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  gender: "Male",
  location: {
    name: "Earth (Replacement Dimension)"
  },
  episode: [
    "https://rickandmortyapi.com/api/episode/1",
    "https://rickandmortyapi.com/api/episode/2"
  ]
};

describe("matchesCharacterSearch", () => {
  it("deve encontrar pelo nome", () => {
    expect(matchesCharacterSearch(mockCharacter, "rick")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "morty")).toBe(false);
  });

  it("deve encontrar pelo status", () => {
    expect(matchesCharacterSearch(mockCharacter, "alive")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "dead")).toBe(false);
  });

  it("deve encontrar pela espécie", () => {
    expect(matchesCharacterSearch(mockCharacter, "human")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "alien")).toBe(false);
  });

  it("deve encontrar pelo gênero", () => {
    expect(matchesCharacterSearch(mockCharacter, "male")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "female")).toBe(false);
  });

  it("deve encontrar pela localização", () => {
    expect(matchesCharacterSearch(mockCharacter, "earth")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "citadel")).toBe(false);
  });

  it("deve encontrar por trecho da URL do episódio (busca simples pelo número do episódio)", () => {
    expect(matchesCharacterSearch(mockCharacter, "1")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "99")).toBe(false);
  });

  it("deve encontrar por episódio usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "episodio=1")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "episodio=99")).toBe(false);
  });

  it("deve encontrar pelo nome usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "nome=Rick")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "nome=Morty")).toBe(false);
  });

  it("deve encontrar pelo status usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "status=Alive")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "status=Dead")).toBe(false);
  });

  it("deve encontrar pela espécie usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "especie=Human")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "especie=Alien")).toBe(false);
  });

  it("deve encontrar pelo gênero usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "genero=Male")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "genero=Female")).toBe(false);
  });

  it("deve encontrar pela localização usando filtro avançado", () => {
    expect(matchesCharacterSearch(mockCharacter, "localizacao=Earth")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "localizacao=Citadel")).toBe(false);
  });

  it("deve ser insensível a maiúsculas/minúsculas e espaços", () => {
    expect(matchesCharacterSearch(mockCharacter, "  RiCk  ")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, " HuMaN ")).toBe(true);
    expect(matchesCharacterSearch(mockCharacter, "status=ALIVE")).toBe(true);
  });
});