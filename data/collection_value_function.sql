delimiter $$
create function `collection_value`(collection_id int) returns double
begin
    declare done int default false;
    declare total_value real default 0;
    declare usd real;
    declare normal_qty, foil_qty int;
	declare cur cursor for 
		select sc.usd, cc.normal_qty, cc.foil_qty from collections co left join 
			(collection_card cc, cards ca, scryfall_cards sc) on 
			(cc.collection_id = co.id and ca.id = cc.card_id and sc.id = ca.scryfall_id)
		where co.id = collection_id;
	declare continue handler for not found set done = true;
    
    open cur;
    read_loop: loop
		fetch cur into usd, normal_qty, foil_qty;
        if done then
			leave read_loop;
		end if;
        set total_value = total_value + usd * (normal_qty + foil_qty);
	end loop;
    close cur;
return total_value;
end$$
delimiter ;
