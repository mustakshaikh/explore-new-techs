import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class InsertionSort {
    public static void main(String args[]) {
        int number[]={10,9,8,7,7,6,5,4,3,2,1,7};
        int mini=0;
        int temp=0;
        for(int i=0;i< number.length;i++){
            mini=SelectionSort(number,i);
            temp=number[i];
            number[i]=number[mini];
            number[mini]=temp;
        }
        System.out.println(Arrays.toString(number));
        }
        
    private static int SelectionSort(int[] num,int start){
        int min=num[start];
        int mini=start;
        for(int i=start+1;i<num.length;i++){
            if(min > num[i]){
               mini=i;
            }
        }
        
        return mini;
    }
    }
    
