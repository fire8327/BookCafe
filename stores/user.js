// Вспомогательные функции для работы с cookies
function useSynchronizedCookie(key, defaultValue) {
    const cookie = useCookie(key)
    const state = ref(cookie.value || defaultValue)

    watch(state, (newValue) => {
        cookie.value = newValue
    })

    return state
}

// Хранилище состояния пользователя
export const useUserStore = defineStore("user", () => {
    const authenticated = useSynchronizedCookie('authenticated', false)
    const id = useSynchronizedCookie('id', null)
    const role = useSynchronizedCookie('role', null)

    /* сообщения и роутер */
    const { showMessage } = useMessagesStore()
    const router = useRouter()

    // Функции для входа и выхода из аккаунта
    function login(userId, userRole) {
        authenticated.value = true
        id.value = userId
        role.value = userRole
    }

    function logout() {
        authenticated.value = false
        id.value = null
        role.value = null
        showMessage("Успешный выход", true)
        router.push("/")
    }

    return { authenticated, id, role, login, logout }
})