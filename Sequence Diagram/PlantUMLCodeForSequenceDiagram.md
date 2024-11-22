@startuml
actor User
participant System
participant Character
participant AIEngine
participant Chat
participant City
User -> System: Login()
System -> User: Show available characters
User -> System: SelectCharacter(characterId)
System -> Character: LoadCharacter(characterId)
Character --> System: Character loaded
User -> System: Show character details
User -> System: CustomizeCity()
System -> City: LoadCurrentCity()
City --> System: Current city loaded
User -> System: Add/Remove/Move Elements
System -> City: City updated
City --> System: Update confirmed
User -> System: OpenChat()
System -> Chat: LoadChatHistory(chatId)
Chat --> System: Chat history loaded
System -> User: Display chat history
User -> System: SendMessage(message)
System -> AIEngine: GenerateResponse(message)
AIEngine --> System: Response
System -> User: DisplayResponse()
User -> System: ViewChatHistory(chatId)


System -> Chat: RetrieveChatHistory(chatId)
Chat --> System: Chat history retrieved
System -> User: DisplayChatHistory()
User -> System: ParticipateInEvents(eventId)
System -> Character: GetEventDetails(eventId)
Character --> System: Event details
System -> User: Event participation result
@enduml