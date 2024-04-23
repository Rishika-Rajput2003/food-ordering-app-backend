import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurant= async(req: Request, res: Response) => {
    try {
        const city= req.params.city;

        const searchQuery= (req.query.searchQuery as string) || "";
        const selectedCuisines= (req.query.selectedCuisines as string)|| "";
        const sortOption= (req.query.sortOption as string)|| "lastUpdated";
        const page= parseInt(req.query.page as string)|| 1;

        let query: any= {};
        // assigning query a type would be difficult as type woulb be complicated and multiple

        query["city"]= new RegExp(city, "i");
        // regexp means ignore case

        const cityCheck= await Restaurant.countDocuments(query);
        if(cityCheck===0){
            return res.status(404).json(
                {
                    data: [],
                    pagination: {
                        total:0,
                        page:1,
                        pages:1,
                    },
                }
            );
            // array is passed beacude frontend will be expecting an array of answers
        }

        if(selectedCuisines){
            //URL= selectedCuisines= indian, pasta
            // [indian, pasta]

            const cuisinesArray= selectedCuisines.split(",")
            .map((cuisine) => new RegExp(cuisine, "i"));

            query["cuisines"]= {$all: cuisinesArray};
            // it will select restaurant which have all these cuisines in them
        }

        if(searchQuery){
            // restaurantName= Pizza Palace
            // cuisines= [pasta, pizza, indian]
            // searchQuery= Pasta
            // so it will return this rest

            const searchRegex= new RegExp(searchQuery, "i");
            query["$or"]= [
                {restaurantName: searchRegex},
                {cuisines: {$in: [searchRegex]}},
            ];
            // serach for rest whose anme matched searchRegex and have any cuisines in it not necessary all thats why in is used
        }

        const pageSize= 10;
        const skip= (page - 1)*pageSize;
        // if frontend asks for page 2 then it will skip (2-1)*10= 10 ..so first 10 rest and will show next 10 

        //sortOption= "lastUpdated"
        const restaurants= await Restaurant
        .find(query)
        .sort({[sortOption]: 1})
        .skip(skip)
        .limit(pageSize)
        .lean(); 
        // lean strips out all mongoids and metadata and shows plain javascript

        const total= await Restaurant.countDocuments(query);

        const response= {
            data: restaurants,
            pagination:{
                total,
                page,
                pages: Math.ceil(total/pageSize),
            },
        };

        res.json(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
        
    }
};

export default {
    searchRestaurant,
};