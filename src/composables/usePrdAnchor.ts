import { ref } from 'vue'

export const dialogAnchor = ref<string>('')

export function setPrdAnchor(anchor: string) {
  dialogAnchor.value = anchor
}
