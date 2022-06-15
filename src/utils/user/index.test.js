import { doesUserExist } from ".";


test('checks if user exists in array', () => {
    expect(doesUserExist(['chris'], 'chris')).toBe(true)
    expect(doesUserExist(['Bill'], 'ted')).toBe(false)
})