@startuml
class User {

- userId: String
- username: String
- password: String
+ selectCharacter(): void
+ customizeCity(): void
+ chat(): void
+ viewChatHistory(): void
+ login(): void
}
class Character {
- characterId: String
- name: String
+ participateInEvents(): void
+ communicateWithAI(): void
}
class AIEngine {
- model: String
+ generateResponse(): String
}
class Chat {
- chatId: String
- messages: List<Message>
+ saveChatHistory(): void
}


class City {

- buildings: List<Building>
- parks: List<Park>
- rivers: List<River>
- publicSpaces: List<PublicSpace>
+ addElement(): void
+ removeElement(): void
+ moveElement(): void
}
User "1" -- "1" AIEngine
User "1" -- "0" Chat
AIEngine "1" -- "1" Character
User "1" -- "0" Character
Character "1" -- "0..*" Chat
User "1" -- "1" City
@enduml