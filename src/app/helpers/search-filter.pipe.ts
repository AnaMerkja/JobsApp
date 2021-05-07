import { Pipe, PipeTransform } from '@angular/core';
import { JobOffers } from '../models/jobOffers.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(list: JobOffers[], filterText: string): any {
    return list ? list.filter(item => item.jobTitle.search(new RegExp(filterText, 'i')) > -1) : [];
  }

}
