import {AbstractControl} from "@angular/forms";

export const restrictedWords = (words: string[]) =>
    (control: AbstractControl): Record<string, any> | null => {
        if (!words) return null;

        const invalidWords = words
            .map(word => control.value.includes(word) ? word : null)
            .filter(word => word !== null)

        return invalidWords && invalidWords.length > 0 ? {'restrictedWords': invalidWords.join(', ')} : null
    }