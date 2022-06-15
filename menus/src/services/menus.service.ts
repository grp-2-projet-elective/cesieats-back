import { Menu, IMenu } from 'models/menus.model';
import { NotFoundException } from 'utils/exceptions';

export class MenusService {
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
}
