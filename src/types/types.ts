export interface IMessage {
    type: "reg" | "update_winners" | "create_room" | "add_user_to_room" | "create_game" | "update_room" | "start_game" | "attack" | "randomAttack" | "turn" | "finish",
    data: {
        name: string,
        password: string
    },
    id: number
}