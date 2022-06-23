import axios from 'axios';
import { environment } from 'environment/environment';
import { IMenu, Menu } from 'models/menus.model';
import { Roles } from 'models/users.model';
import { Exception, NotFoundException } from 'utils/exceptions';

export class MenusService {
    private static instance: MenusService;

    constructor() {
        MenusService.instance = this;
    }

    /**
     * Trouve tous les menus
     */
    async findAll(): Promise<Array<IMenu>> {
        try {
            const menus = await Menu.find();

            return menus;
        } catch (e) {
            throw new NotFoundException('No menus found');
        }
    }

    /**
     * Trouve un menu en particulier
     * @param id - ID unique de l'menu
     */
    async findOne(id: string): Promise<IMenu | null | undefined> {
        try {
            const menu = await Menu.findById(id);

            return menu;
        } catch (e) {
            throw new NotFoundException('No menu found');
        }
    }

    /**
     * Met à jour un menu en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param menuData - Un objet correspondant à un menu, il ne contient pas forcément tout un menu. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'menu
     */
    async update(id: string, menuData: Partial<IMenu>): Promise<IMenu | null | undefined> {
        const menu = await this.findOne(id);

        if (!menu) {
            throw new NotFoundException('No menu found');
        }

        const updatedMenu = await Menu.findByIdAndUpdate(id, menuData, { new: true });

        return updatedMenu;
    }

    /**
     * Créé un menu
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param menuData - Un objet correspondant à un menu. Attention, on ne prend pas l'id avec.
     */
    async create(menuData: IMenu): Promise<IMenu> {
        const newMenu: IMenu = await Menu.create(menuData);

        return newMenu;
    }

    /**
     * Suppression d'un menu
     */
    async delete(id: string) {
        const menu = await this.findOne(id);

        if (!menu) {
            throw new NotFoundException('No menu found');
        }

        await Menu.findByIdAndRemove(id);
    }

    public async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/asRole/${mail}/${role}`;

            const asRole = ((await axios.get(apiUrl))).data as boolean;
            return asRole;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public static async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const user = await this.instance.asRole(mail, role);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }
}
