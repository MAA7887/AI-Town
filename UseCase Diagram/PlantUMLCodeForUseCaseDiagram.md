@startuml

actor User

actor AI_Character

' Main interactions

User --> (Create Profile): "User creates a character with specific appearance, behavior, and social
attributes."

User --> (Customize City Environment): "User adds, removes, or moves elements like buildings, parks,
rivers, etc."

User --> (Chat with Character): "User and AI character engage in natural language chat powered by GPT-
4 or Llama 3."

User --> (View Character Chat History): "User views chat history between their character and other
characters."

User --> (Join Events): "User participates in social events where AI characters collaborate on tasks."

' AI interactions

AI_Character --> (Chat with User)

AI_Character --> (Participate in Events)

' Expand "Join Events"

(Join Events) --> (Collaborate with Other Characters): "AI characters collaborate and share information in
response to events like crisis management."

@enduml